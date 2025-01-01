const MyComponent = ({ className }: { className: string }) => {
  return <div className={className}>Hello World!!!</div>;
};
const App = () => {
  return (
    <div>
      <MyComponent className="myClass" />
    </div>
  );
};

export default App;
