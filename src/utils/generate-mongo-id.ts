import { ObjectId } from 'mongodb';

// Generate a unique MongoDB-like ID
const generateMongooseID = () => {
  return new ObjectId().toHexString();
};

export { generateMongooseID }

