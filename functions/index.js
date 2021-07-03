const functions = require('firebase-functions');
const app = require('express')();
const auth = require('./util/auth');

const {
    getAllGoals,
    getOneGoal,
    postOneGoal,
    deleteGoal,
    editGoal
} = require('./apis/goals')

const {
    loginUser,
    signUpUser,
    uploadProfilePhoto,
    getUserDetail,
    updateUserDetails
} = require('./apis/users')

app.get('/goals', getAllGoals);
app.get('/goal/:goalId', auth, getOneGoal);
app.post('/goal', postOneGoal);
app.delete('/goal/:goalId', deleteGoal);
app.put('/goal/:goalId', editGoal);

app.post('/login', loginUser);
app.post('/signup', signUpUser);
app.post('/user/image', auth, uploadProfilePhoto);
app.get('/user', auth, getUserDetail);
app.post('/user', auth, updateUserDetails);

exports.api = functions.https.onRequest(app);
