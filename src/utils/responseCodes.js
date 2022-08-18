export const ResponseCodes = {
  /* /////////////////////AUTH///////////////////////////// */
  user_created: 'user_created',
  no_user_found: 'no_user_found',
  wrong_password: 'wrong_password',
  email_unverified: 'email_unverified',
  wrong_credential: 'wrong_credential',
  token_created: 'token_created',
  email_confirmed: 'email_confirmed',
  email_sent: 'email_sent',
  wrong_token: 'wrong_token',
  password_updated: 'password_updated',

  /* /////////////////////USER///////////////////////////// */
  user_updated: 'user_updated',
  availabilities_updated: 'availabilities_updated',
  fcm_token_saved: 'fcm_token_saved',

  /* //////////////////////SELECTS_LISTS////////////////////// */
  selects_lists_added: 'selects_lists_added',
  wrong_property_type: 'wrong_property_type',
  selects_lists_already_exist: 'selects_lists_already_exist',
  selects_lists_type_not_found: 'selects_lists_type_not_found',
  selects_lists_updated: 'selects_lists_updated',
  selects_lists_deleted: 'selects_lists_deleted',
  selects_lists_not_found: 'selects_lists_not_found',

  /* //////////////////////PROPERTY////////////////////// */
  property_updated: 'property_updated',
  no_property_id: 'no_property_id',
  no_like_own_property: 'no_like_own_property',
  property_liked: 'property_liked',
  property_disliked: 'property_disliked',
  propertyDeleted: 'propertyDeleted',
  propertyValidated: 'propertyValidated',

  /* //////////////////////PROPERTY_PREFERENCE////////////////////// */
  property_preference_updated: 'property_preference_updated',
  no_property_preference_id: 'no_property_preference_id',

  /* //////////////////////MEETING////////////////////// */
  no_meeting_id: 'no_meeting_id',
  meeting_created: 'meeting_created',
  meeting_updated: 'meeting_updated',
  no_availability: 'no_availability',
  visit_not_done_yet: 'visit_not_done_yet',
  offer_not_made_yet: 'offer_not_made_yet',
  no_meetings: 'no_meetings',
  meetingDeleted: 'meetingDeleted',

  /* /////////////////////FILE///////////////////////////// */
  upload_error: 'upload_error',
  file_uploaded: 'file_uploaded',
  file_too_big: 'file_too_big',
  file_not_found: 'file_not_found',
  file_validated: 'file_validated',

  /* /////////////////////GENERAL///////////////////////////// */
  server_error: 'server_error',
  validation_error: 'validation_error',
  data: 'data',
  unauthorized: 'unauthorized',
  wrong_id: 'wrong_id',
  invalid_jwt_token: 'invalid_jwt_token'
}
