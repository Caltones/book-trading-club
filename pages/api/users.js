import Users from '../../models/Users';
import dbConnect from '../../lib/dbConnect';

export default async function handler(_req, res) {
  await dbConnect();
  res.status(200).json(await Users.find({}).select('name image'));
}
