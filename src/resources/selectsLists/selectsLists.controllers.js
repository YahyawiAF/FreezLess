import { createSelectsListsInstance, SelectsLists } from './selectsLists.model'
import { ResponseCodes } from '../../utils/responseCodes'
import { SelectsListsTypes } from './selectsListsTypes.enum'

export const getAll = (req, res, next) => {
  SelectsLists.find({})
    .then(selectsLists => {
      return res.status(200).json({
        success: true,
        responseCode: ResponseCodes.data,
        selectsLists: selectsLists
      })
    })
    .catch(err => {
      return next(err)
    })
}

export const add = (req, res, next) => {
  let selectsListsType = req.body.selectsListsType
  let selectsListsId = req.body.id
  if (Object.values(SelectsListsTypes).indexOf(selectsListsType) < 0) {
    return res.status(404).json({
      success: false,
      responseCode: ResponseCodes.selects_lists_type_not_found
    })
  }
  SelectsLists.findById(selectsListsId, (err, selectsLists) => {
    if (err) return next(err)
    if (!selectsLists) {
      SelectsLists.findOne(
        {
          code: req.body.code,
          type: selectsListsType
        },
        (err, existingSelectsLists) => {
          if (err) return next(err)
          if (existingSelectsLists) {
            return res.status(409).json({
              success: false,
              responseCode: ResponseCodes.selects_lists_already_exist
            })
          }
          let selectListElement = createSelectsListsInstance(
            selectsListsType,
            req.body
          )

          selectListElement
            .save()
            .then(() => {
              return res.status(200).json({
                success: true,
                responseCode: ResponseCodes.selects_lists_added
              })
            })
            .catch(err => {
              return next(err)
            })
        }
      )
    } else {
      selectsLists = Object.assign(selectsLists, req.body)

      selectsLists
        .save()
        .then(() => {
          return res.status(200).json({
            success: true,
            responseCode: ResponseCodes.selects_lists_updated
          })
        })
        .catch(err => {
          return next(err)
        })
    }
  })
}

export const deleteSelectsLists = (req, res, next) => {
  let selectsListsId = req.body.id
  SelectsLists.findByIdAndDelete(selectsListsId, (err, deletedSelectsLists) => {
    if (err) return next(err)
    if (!deletedSelectsLists) {
      return res.status(404).json({
        success: false,
        responseCode: ResponseCodes.selects_lists_not_found
      })
    }
    return res.status(200).json({
      success: true,
      responseCode: ResponseCodes.selects_lists_deleted
    })
  })
}
