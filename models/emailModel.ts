import mongoose, { Schema, model, models } from 'mongoose';

const emailSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

const EmailModel = models.Email || model('Email', emailSchema);

export default EmailModel;
