import React from 'react';
import Header from './Header';
import Order from './Order';
import Inventory from './Inventory';
import Fish from './Fish';
import sampleFishes from '../sample-fishes';
import Base from '../base';

class App extends React.Component {
  constructor() {
    super();

    this.addFish = this.addFish.bind(this);
    this.updateFish = this.updateFish.bind(this);
    this.removeFish = this.removeFish.bind(this);
    this.loadSamples = this.loadSamples.bind(this);
    this.addToOrder = this.addToOrder.bind(this);
    this.removeFromOrder = this.removeFromOrder.bind(this);


    // initial state
    this.state = {
      fishes: {},
      order: {}
    };
  }

  componentWillMount() {
    //this runs right before <App> is rendered
    this.ref = Base.syncState(`${this.props.params.storeId}/fishes`,
      {
        context: this,
        state: 'fishes'
      });

    //check if there is any order in localStorage
    const localStorageRef = localStorage.getItem(`order-${this.props.params.storeId}`);
    if(localStorageRef) {
      //update our App component's order state
      this.setState({
        order: JSON.parse(localStorageRef)
      });
    }
  }

  componentWillUnmount() {
    Base.removeBinding(this.ref);
  }

  componentWillUpdate(nextProps, nextState) {
    localStorage.setItem(`order-${this.props.params.storeId}`, JSON.stringify(nextState.order));
  }

  addFish(fish) {
    //update our state
    const fishes = {...this.state.fishes};
    //add in our new fish
    const timestamp = Date.now();
    fishes[`fish-${timestamp}`] = fish;
    //set state
    this.setState({ fishes });

  }

  updateFish(key, updatedFish) {
    const fishes = {...this.state.fishes}; //we can do this without decomposition
    fishes[key] = updatedFish;
    this.setState({ fishes });
  }

  removeFish(key) {
    const fishes = {...this.state.fishes};
    fishes[key] = null;
    this.setState({ fishes });
  }

  loadSamples() {
    this.setState({
      fishes: sampleFishes
    });
  }

  addToOrder(key) {
    //copy our state
    const order = {...this.state.order};
    //update or add the new number of fish ordered
    order[key] = order[key] + 1 || 1;
    //update our state
    this.setState({ order });
  }

  removeFromOrder(key){
    const order = {...this.state.order};
    delete order[key];
    this.setState({ order });
  }

  render() {
    console.log(Object.keys(this.state.fishes).length);
    return (
      <div className="catch-of-the-day">
        <div className="menu">
           <Header tagline="Fresh Seafood Market"/>
           { Object.keys(this.state.fishes).length > 0 &&
             <ul className="list-of-fishes">
             {
                Object
                  .keys(this.state.fishes)
                  .map(key => <Fish key={key} index={key} details={this.state.fishes[key]} addToOrder={this.addToOrder}/>)
             }
             <Fish/>
            </ul>
           }
           
        </div>
        <Order
            fishes={this.state.fishes}
            order={this.state.order}
            removeFromOrder={this.removeFromOrder}
            params={this.props.params}
        />
        <Inventory 
          addFish={this.addFish}
          loadSamples={this.loadSamples}
          fishes={this.state.fishes}
          updatedFish={this.updateFish}
          removeFish={this.removeFish}
        />
      </div>
    )
  }
}

export default App;