import { loginUser, getPostByDatabaseID } from '../../lib/api';

export default async function handler(req, res) {
  // const { p } = req.query;
  
  // const user = await loginUser('inl_user', 'inl_headlessDemo');

  // const post = await getPostByDatabaseID(p, user.refreshToken);

  // res.setPreviewData({
  //   refreshToken: user.refreshToken
  // });

  // res.setPreviewData({})

  res.end('Preview Mode Enabled');
}