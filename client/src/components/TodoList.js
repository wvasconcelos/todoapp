import { gql, useQuery } from '@apollo/client'
import Table from 'react-bootstrap/Table';
import { FaTrash } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { MdDone } from "react-icons/md";
import 'bootstrap/dist/css/bootstrap.min.css';
import Spinner from 'react-bootstrap/Spinner';
import { useMutation } from '@apollo/client';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useState } from 'react';

const ADD_TODO = gql`
    mutation addTodo($title: String!, $completed: Boolean!){
        addTodo(title:$title, completed: $completed){
            id,
            title,
            completed
        }
    }
`;

const DELETE_TODO = gql`
    mutation deleteTodo($id: ID!){
        deleteTodo(id: $id){
            id,
            title,
            completed
        }
    }
`


const GET_TODOS = gql`
    query getTodos{
        todos{
            id,
            title,
            completed
        }
    }
`;

const UPDATE_TODO = gql`
    mutation updateTodo($id: ID!, $title: String!){
        updateTodo(id: $id, title: $title) {
            id, 
            title,
            completed
        }
    }
`;

const TOGGLE_TODO = gql`
    mutation toggleTodo($id: ID!){
        toggleTodo(id: $id) {
            id, 
            title,
            completed
        }
    }
`;


export default function TodoList(){
    const [title, setTitle] = useState("")
    const completed = false

    const [editMode, setEditMode] = useState(false)
    const [editTodo, setEditTodo] = useState(null)
    const buttonTitle = editMode ? "Update" : "Add";

    const [updateTodo] = useMutation(UPDATE_TODO);
    const modifyTodo = (id, title) => {
        updateTodo({
            variables:{id: id, title: title},
            refetchQueries: [{ query: GET_TODOS }]
        })
    }

    const [addTodo] = useMutation(ADD_TODO,{
        variables: {title, completed},
        refetchQueries: [{ query: GET_TODOS}],
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if(title === "") return alert('Please, fill in the todo title');
        if(editMode){
            modifyTodo(editTodo.id, title)
            setEditMode(false)
            setEditTodo(null)
        } else{
            addTodo();
        }

        setTitle('');
    }

    const [deleteTodo] = useMutation(DELETE_TODO);
    const removeTodo=(id)=>{
        deleteTodo({
            variables:{id:id},
            refetchQueries: [{ query: GET_TODOS}]
        })
    }
    const { loading, error, data } = useQuery(GET_TODOS);

    const [toggleTodo] = useMutation(TOGGLE_TODO);
    const markTodo=(id) =>{
        toggleTodo({
            variables:{id: id},
            refetchQueries: [{ query: GET_TODOS }]
        });
    }

    if ( loading ) return <Spinner animation="border" />;;
    if ( error ) { console.log(error); return <p>Something went wrong!</p>; }
    
    return (
        <>
        <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
                <Form.Control type="text" placeholder="Enter To Do" onChange={e => setTitle(e.target.value)} value={title} />
            </Form.Group>
            <Button variant="primary" type="submit">
                {buttonTitle}
            </Button>
        </Form>
        {!loading && !error && (
            <Table striped bordered hover>
            <thead>
                <tr>
                    <th>To Do</th>
                    <th>Edit</th>
                    <th>Delete</th>
                    <th>Complete</th>
                </tr>
            </thead>
            <tbody>
            {data.todos.map((todo) =>(
                <tr key={todo.id} className={`${todo.completed ? "text-decoration-line-through" : ""}`}>
                    <td>{todo.title}</td>
                    <td><Button variant="warning" onClick={() => { 
                            setTitle(todo.title) 
                            setEditMode(true) 
                            setEditTodo(todo)}}>
                                <FaEdit />
                        </Button>
                    </td>
                    <td><Button variant="danger" onClick={() => removeTodo(todo.id)}><FaTrash /></Button></td>
                    <td>
                        <Button variant="success" onClick={() => markTodo(todo.id)}>
                        <MdDone />
                        </Button>
                    </td>
                </tr>
            ))}
            </tbody>
        </Table>

        )}
        </>
    );
}
