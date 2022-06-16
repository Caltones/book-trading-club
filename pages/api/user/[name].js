import book_model from '../../../models/Books'
import dbConnect from '../../../lib/dbConnect'
export default async function handler(req,res) {
  await dbConnect()
  const query_res = await book_model.find({owner: req.query.name}).select(' -description -bumped_on')
  res.status(200).json(query_res)

}
