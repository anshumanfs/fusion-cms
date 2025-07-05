import Express from 'express';

const router = Express.Router();

router.post('/theme', (req, res) => {
  // Get the theme preference from the request body
  const { theme } = req.body;

  // Validate the theme
  if (theme !== 'light' && theme !== 'dark') {
    return res.status(400).json({
      success: false,
      message: 'Invalid theme. Must be "light" or "dark".',
    });
  }

  // Set the theme cookie
  res.cookie('theme', theme, {
    maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });

  // Determine response based on request type
  if (req.headers.accept?.includes('application/json')) {
    return res.json({
      success: true,
      theme,
    });
  }

  // For regular form submissions, redirect back to the referer or home page
  res.redirect(req.headers.referer || '/');
});

export default router;
