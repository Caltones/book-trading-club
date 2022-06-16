import request_model from '../../models/Request';
import book_model from '../../models/Books';
import dbConnect from '../../lib/dbConnect';
import mongoose from 'mongoose';
import { getSession } from 'next-auth/react';
export default async function handler(req, res) {
  if (req.method !== 'PUT')
    return res.status(200).json({ err: 'use PUT instead' });
  const session = await getSession({ req });
  if (!session) return res.status(200).json({ err: 'auth error' });
  await dbConnect();
  const requestInfo = await request_model.findOneAndUpdate(
    {
      _id: mongoose.Types.ObjectId(req.body._id),
    },
    { accepted: true }
  );

  await book_model.findOneAndUpdate(
    { _id: mongoose.Types.ObjectId(requestInfo.bookId_that_give) },
    { owner: requestInfo.request_receiver, bumped_on: new Date() }
  );
  await book_model.findOneAndUpdate(
    {
      _id: mongoose.Types.ObjectId(requestInfo.bookId_that_want),
    },
    { owner: requestInfo.request_sender, bumped_on: new Date() }
  );

  return res.status(200).json();
}
