// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const faunadb = require("faunadb");;
const client = new faunadb.Client({
  secret: "fnAE8GeOLBACWb80cEJumdgdQtFHHoBRi6M9erZB"
});
const q = faunadb.query;

export default function handler(req, res) {
  switch (req.method) {
    case "POST":
      {
        console.log("method is POST");
        const todo = req.body;
        const createddate =new Date().toString();
        console.log(todo)
        client
          .query(
            q.Create(q.Collection("todos"), {
              data: {
                todo: todo.todo,
                isCompleted: todo.isCompleted,
                createdAt: createddate,
                test:"test"
              }
            })
          )
          .then(response => {
            console.log("Todo added successfully",response);
            res.status(200).json({response});
          })
          .catch(error => {
            console.error(error);
            res.status(400).json({ "Error": error.message });
          });
      }
      break;

    case "GET":
      {
        client
          .query(q.Paginate(q.Match(q.Ref("indexes/all_todo"))))
          .then(response => {
            const todoRefs = response.data;
            console.log("Todo refs", todoRefs);
            const getAllTodoDataQuery = todoRefs.map(ref => {
              return q.Get(ref);
            });
            return client.query(getAllTodoDataQuery).then(ret => {
              return res.status(200).json(ret);
            });
          })
          .catch(error => {
            console.log("Error", error);
            return res.status(400).json({ error });
          });
        break;

      }

    case "PUT":
      {
        console.log("method is PUT");
        const { id, todo, isCompleted, createdAt } = req.body;
        client
          .query(
            q.Update(q.Ref(q.Collection("todos"), id), {
              data: {
                todo: todo,
                isCompleted: isCompleted,
                createdAt,
              }
            })
          )
          .then(response => {
            console.log("Todo updated successfully");
            res.status(200).json({ "Message": "Todo updated successfully", "Todo": response });
          })
          .catch(error => {
            console.error(error);
            res.status(400).json({ "Error": error.message });
          });
      }
      break;


    case "DELETE":
      {
        console.log("method is DELETE");
        const todoId = req.body;
        client
          .query(q.Delete(q.Ref(q.Collection("todos"), todoId)))
          .then(response => {
            console.log("Todo deleted successfully");
            res.status(200).json({ "Message": "Todo deleted successfully" });
          })
          .catch(error => {
            console.error(error);
            res.status(400).json({ "Error": error.message });
          });
      }
      break;

    default: {
      console.log("You got Ligma");
      res.status(200).json({ "Message": "You got Ligma" })
    }


  }
}
