import { ResponseCodes } from '../../utils/responseCodes'
import { UploadedFile } from '../uploadedFile/uploadedFile.model'
import { Roles } from '../user/roles.enum'
let path = require('path')
let multer = require('multer')
let fs = require('fs')

const pathToUploads = '../../../uploads'

export const uploadFile = (req, res, next) => {
  let files = []
  let originalName = ''
  let extension = ''
  let size = 0
  let uploadedFile
  let storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, pathToUploads))
    },
    filename: (req, file, cb) => {
      originalName = file.originalname
      extension = path.extname(file.originalname)
      size = file.size
      uploadedFile = new UploadedFile({
        fileName: originalName,
        originalName: originalName,
        fileExtension: extension,
        fileSize: size,
        user: req.user,
        property: req.body.property,
        meeting: req.body.meeting
      })
      uploadedFile.save((err, file) => {
        if (err) return next(err)
        files.push(file.id)
        cb(err, file.id)
      })
    },
    fileSize: 5000000
  })

  let upload = multer({ storage: storage }).array('file', 10)
  upload(req, res, err => {
    if (err instanceof multer.MulterError) {
      return res.json({
        success: false,
        responseCode: ResponseCodes.upload_error,
        error: err
      })
    } else if (err) {
      return next(err)
    }
    return res.status(200).json({
      success: true,
      responseCode: ResponseCodes.file_uploaded,
      data: files
    })
  })
}

export const getFile = (req, res, next) => {
  let fieldsToPopulate
  if (req.user.roles.indexOf(Roles.Admin) > -1) {
    fieldsToPopulate = 'user property meeting'
  }
  UploadedFile.findById(req.body.uploadedFile, (err, uploadedFile) => {
    if (err) return next(err)
    if (!uploadedFile) {
      return res.status(201).json({
        success: false,
        responseCode: ResponseCodes.wrong_id
      })
    }
    return res.status(201).json({
      success: true,
      responseCode: ResponseCodes.data,
      data: uploadedFile
    })
  }).populate(fieldsToPopulate)
}

export const getAllFiles = (req, res, next) => {
  UploadedFile.find({}, (err, uploadedFiles) => {
    if (err) return next(err)
    return res.status(201).json({
      success: true,
      responseCode: ResponseCodes.data,
      data: uploadedFiles
    })
  }).populate('user property meeting')
}

export const getFilesToValidate = (req, res, next) => {
  UploadedFile.find(
    {
      validated: false,
      refused: false
    },
    (err, uploadedFiles) => {
      if (err) return next(err)
      return res.status(201).json({
        success: true,
        responseCode: ResponseCodes.data,
        data: uploadedFiles
      })
    }
  ).populate('user property meeting')
}

export const validate = (req, res, next) => {
  let uploadedFile = req.body.uploadedFile
  switch (req.body.status) {
    case 'valid':
      uploadedFile.validated = true
      break
    case 'refuse':
      uploadedFile.refused = true
      break
  }
  uploadedFile.save((err, savedUploadedFile) => {
    if (err) return next(err)
    return res.status(201).json({
      success: true,
      responseCode: ResponseCodes.file_validated
    })
  })
}

export const downloadFile = (req, res, next) => {
  let fileName = req.params.fileName
  let id = req.params.id
  UploadedFile.findOne(
    {
      _id: id,
      fileName: fileName
    },
    (err, file) => {
      if (err) return next(err)
      if (
        !file ||
        !fs.existsSync(path.join(__dirname, pathToUploads, file.id))
      ) {
        res.status(404).json({
          success: false,
          responseCode: ResponseCodes.file_not_found
        })
      } else {
        return res.download(path.join(__dirname, pathToUploads, file.id))
      }
    }
  )
}
