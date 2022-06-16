
import Books from '../../../models/Books';
import dbConnect from '../../../lib/dbConnect';
export default async function handler(req, res) {
  const { method } = req;
  await dbConnect()
  if (method !== 'POST') {
    return res.status(200).json({ err: 'Use POST instead' });
  }

  let temp = new Books({
    name : req.body.bookName,
    owner: req.query.name,
    author : req.body.author,
    description : req?.body?.description ?? ''
  })
  await temp.save()
  return res.status(200).json(temp)
  

}
