const Routes = require('express');
const auth = require('./../middleware/auth');
const authIsAdmin = require('./../middleware/authIsAdmin');
const UserRouter = require('./UserRoutes');
const AdminRouter = require('./AdminRoutes');
const DashboardRoutes = require('./DashboardRoutes');

const router = new Routes();

router.use('/user', UserRouter);
router.use('/home', auth, DashboardRoutes);
router.use('/admin', authIsAdmin, AdminRouter);

module.exports = router;