import request_model from '../../../../models/Request';
import dbConnect from '../../../../lib/dbConnect';
export default async function handler(req, res) {
  await dbConnect();
  const query_res = await request_model.find({
    request_receiver: req.query.name,
    accepted : false
  });
    
  res.status(200).json(query_res);
}
