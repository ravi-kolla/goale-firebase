const { db } = require('../util/admin');

exports.getAllGoals = (request, response) => {
	db
		.collection('goals')
		.where('username', '==', request.user.username)
		.orderBy('createdAt', 'desc')
		.get()
		.then((data) => {
			let goals = [];
			data.forEach((doc) => {
				goals.push({
          goalId: doc.id,
          title: doc.data().title,
					body: doc.data().description,
					createdAt: doc.data().createdAt,
				});
			});
			return response.json(goals);
		})
		.catch((err) => {
			console.error(err);
			return response.status(500).json({ error: err.code});
		});
};

exports.getOneGoal = (request, response) => {
	db
    .doc(`/goals/${request.params.goalId}`)
		.get()
		.then((doc) => {
			if (!doc.exists) {
				return response.status(404).json(
                {
                    error: 'Todo not found'
                });
        }
        if(doc.data().username !== request.user.username){
            return response.status(403).json({error:"UnAuthorized"})
        }
			GoalData = doc.data();
			GoalData.todoId = doc.id;
			return response.json(TodoData);
		})
		.catch((err) => {
			console.error(err);
			return response.status(500).json({ error: error.code });
		});
};

exports.postOneGoal = (request, response) => {
	if (request.body.description.trim() === '') {
		return response.status(400).json({ description: 'Must not be empty' });
  }

  if(request.body.title.trim() === '') {
      return response.status(400).json({ title: 'Must not be empty' });
  }

  const newGoalItem = {
      title: request.body.title,
      description: request.body.description,
      createdAt: new Date().toISOString(),
			username: request.user.username
  }
  db
      .collection('goals')
      .add(newGoalItem)
      .then((doc)=>{
          const responseGoalItem = newGoalItem;
          responseGoalItem.id = doc.id;
          return response.json(responseGoalItem);
      })
      .catch((err) => {
		response.status(500).json({ error: 'Something went wrong' });
		console.error(err);
	});
};
exports.deleteGoal = (request, response) => {
    const document = db.doc(`/goals/${request.params.goalId}`);
    document
        .get()
        .then((doc) => {
            if (!doc.exists) {
                return response.status(404).json({ error: 'Goal not found' })
            }
            return document.delete();
        })
        .then(() => {
            response.json({ message: 'Delete successfull' });
        })
        .catch((err) => {
            console.error(err);
            return response.status(500).json({ error: err.code });
        });
};
exports.editGoal = ( request, response ) => {
    if(request.body.goalId || request.body.createdAt){
        response.status(403).json({message: 'Not allowed to edit'});
    }
    let document = db.collection('goals').doc(`${request.params.goalId}`);
    document.update(request.body)
    .then(()=> {
        response.json({message: 'Updated successfully'});
    })
    .catch((err) => {
        console.error(err);
        return response.status(500).json({
                error: err.code
        });
    });
};
