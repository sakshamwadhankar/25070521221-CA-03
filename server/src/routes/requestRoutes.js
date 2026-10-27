const express = require('express');
const router = express.Router();
const {
  getSentRequests,
  getReceivedRequests,
  createRequest,
  acceptRequest,
  rejectRequest,
  cancelRequest,
  completeRequest,
  deleteRequest,
} = require('../controllers/requestController');
const { protect } = require('../middleware/auth');

router.use(protect); // All request routes require authentication

router.get('/sent', getSentRequests);
router.get('/received', getReceivedRequests);
router.post('/', createRequest);
router.put('/:id/accept', acceptRequest);
router.put('/:id/reject', rejectRequest);
router.put('/:id/cancel', cancelRequest);
router.put('/:id/complete', completeRequest);
router.delete('/:id', deleteRequest);

module.exports = router;
