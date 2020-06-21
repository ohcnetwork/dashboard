[@react.component]
let make = () => {
  let (count, setCount) = React.useState(() => 0);

  <div>
    <p> {React.string(" clicked " ++ string_of_int(count) ++ " times")} </p>
    <button onClick={_ => setCount(_ => count + 1)}>
      {React.string("Click me")}
    </button>
  </div>;
};
