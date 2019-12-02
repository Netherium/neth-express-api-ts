import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

const BookSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: String
}, {timestamps: true});

export default mongoose.model('Book', BookSchema);
