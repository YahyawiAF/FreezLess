export const addNotification = (user, title, text, type, url) => {
  user.addNotification(title, text, type, url)
  return user.save((err, user) => {
    if (err) return Promise.reject(err)
    return Promise.resolve(user)
  })
}
