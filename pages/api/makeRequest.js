import request_model from '../../models/Request'
import dbConnect from '../../lib/dbConnect'

export default async function handler(req, res) {
  if (req.method!=='POST') return res.status(200).json({ err: 'use POST instead' })
  await dbConnect()
  let query = await request_model.find({request_sender:req.body.request_sender,accepted:false})
  if(query.length >= 1) return res.status(200).json({err:'only one request in a time'})
  let temp = new request_model(req.body)
  temp.save()
  res.status(200).json(temp) 
}