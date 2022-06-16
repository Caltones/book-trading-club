import request_model from "../../models/Request";
import dbConnect from "../../lib/dbConnect";
import mongoose from "mongoose";
import { getSession } from "next-auth/react";
export default async function handler(req, res) {
  if (req.method!=='POST') return res.status(200).json({ err: 'use POST instead' })
  const session = await getSession({req})
  if (!session)  return res.status(200).json({ err: 'auth error' }) 
  await dbConnect()
  const temp = await request_model.deleteOne({_id:mongoose.Types.ObjectId(req.body._id) })
  return res.status(200).json(temp)
}