import book_model from "../../models/Books";
import dbConnect from "../../lib/dbConnect";
import mongoose from "mongoose";
import { getSession } from "next-auth/react";
export default async function handler(req, res) {
  await dbConnect()
  if (req.method!=='POST') return res.status(200).json({ err: 'use POST instead' })
  const session = await getSession({req})
  if (!session)  return res.status(200).json({ err: 'auth error' }) 
  const temp = await book_model.deleteOne({_id:mongoose.Types.ObjectId(req.body._id) })
  return res.status(200).json(temp)
}