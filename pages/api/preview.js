import { loginUser } from '../../lib/api';

export default async function handler(req, res) {
  const { p:draftPostID } = req.query;
  
  const user = await loginUser('inl_user', 'inl_headlessDemo');
  if (!user.refreshToken) {
    res.status(401).json({ message: 'You must be authorized to view this page.' });
  }  

  res.setPreviewData({
    draftPostID,
    refreshToken: user.refreshToken
  });

  res.writeHead(307, { Location: `/blog/${draftPostID}` })
  res.end()
}