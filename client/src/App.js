import{ApolloProvider, ApolloClient, InMemoryCache} from '@apollo/client'
import TodoList from './components/TodoList'

const client = new ApolloClient({
  uri: 'http://localhost:8000/graphql',
  cache: new InMemoryCache()
})

function App() {
  return (
    <>
      <ApolloProvider client={client}>
      <div className="App">
        <div className="flex flex-row">
          <div className="grow"></div>
          <div className="grow-0 max-w-200">
            <h1>Todo App</h1>
            <TodoList />
          </div>
          <div className="grow"></div>
        </div>
      </div>
      </ApolloProvider>
    </>
  );
}

export default App;
