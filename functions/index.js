const functions = require('firebase-functions');
const app = require('express')();

const {
    getAllGoals,
    postOneGoal,
    deleteGoal,
    editGoal
} = require('./apis/goals')

app.get('/goals', getAllGoals);
app.post('/goal', postOneGoal);
app.delete('/goal/:goalId', deleteGoal);
app.put('/goal/:goalId', editGoal);
exports.api = functions.https.onRequest(app);
