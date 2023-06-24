import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [readingList, setReadingList] = useState([]);
  const [authorList, setAuthorList] = useState([]);
  const [book, setBook] = useState("");
  const [author, setAuthor] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .post("http://localhost:4000/graphql", {
        query: `
          query {
            books {
              name,
              genre,
              id,
              author {
                name,
                age,
                books {
                  name,
                  genre
                }
              }
            }
          }
        `,
      })
      .then((res) => {
        console.log(res);
        setReadingList(res.data.data.books);
      })
      .catch((err) => {
        setError(err.code);
      });

    axios
      .post("http://localhost:4000/graphql", {
        query: `
        query {
          authors {
            name,
            age,
            id,
            books {
              name,
              genre
            }
          }
        }
      `,
      })
      .then((res) => {
        console.log(res);
        setAuthorList(res.data.data.authors);
      })
      .catch((err) => {
        setError(err.code);
      });

    axios
      .post("http://localhost:4000/graphql", {
        query: `
          query ($id: ID){
            author (id: $id){
              name,
              age,
              id,
            }
          }
        `,
        variables: { id: 1 }
      })
      .then((res) => {
        console.log(res);
        setAuthor(res.data.data.author.name);
      })
      .catch((err) => {
        setError(err.code);
      });

    axios
      .post("http://localhost:4000/graphql", {
        query: `
          query ($id: ID){
            book (id: $id){
              name,
              genre,
              id,
            }
          }
        `,
        variables: { id: 1 }
      })
      .then((res) => {
        console.log(res);
        setBook(res.data.data.book.name);
      })
      .catch((err) => {
        setError(err.code);
      });

  }, []);

  return (
    <div className="App">
      <h1>Ninja's Reading List</h1>
      <ul>
        {readingList.map((book) => {
          return <p key={book.id}>{book.name}</p>;
        })}
      </ul>
      <ul>
        {authorList.map((author) => {
          return <p key={author.id}>{author.name}</p>;
        })}
      </ul>
      <p>{book}</p>
      <p>{author}</p>
      <p>{error}</p>
    </div>
  );
}

export default App;
