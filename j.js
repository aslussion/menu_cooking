class PrintMeal extends React.Component {
    constructor() {
        super();
    }

    render() {
        //массив из НАЗВАНИЙ ингредиентов
        let arIngredients = [];
        this.props.composition.forEach(
            item => {arIngredients.push(this.props.products[+item]);}
        );
        //массив превращается в строку
        let composition = arIngredients.join(', ');
        composition = <span className='meal-ingredient'>({composition})</span>;
        
        return <li className='meal'>{this.props.name} {composition}</li>;
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            mealsList:{
                1:{
                    'name':'Пудинг банановый',
                    'active':true,
                    'ingredients':[1,2,3,4],
                },
                2:{
                    'name':'Запеканка яблочная',
                    'active':true,
                    'ingredients':[5,2,3,6],
                },
                3:{
                    'name':'Манник',
                    'active':true,
                    'ingredients':[4,7,6,8],
                },
            },
            productNames:{
                1:'банан',
                2:'яйцо',
                3:'молоко',
                4:'манка',
                5:'яблоко',
                6:'сахар',
                7:'кефир',
                8:'орехи',
            },
            
            ingredientSearch:'',
        };
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(event) {
        //универсальный метод, обрабатывает любой инпут. 
        //поэтому name и state инпута должны совпадать
        const name = event.target.name;
        const value = event.target.value;
        this.setState({[name]: value});
        
        //поиск по ингредиентам
        if(value)
            this.findByIngredients(value);
        else
            this.setAllMealsActiveOrNot();
    }
    setAllMealsActiveOrNot(active=true){
        for(let key in this.state.mealsList){
            this.state.mealsList[key]['active'] = active;
            this.setState({mealsList: this.state.mealsList});
        }
    }
    findByIngredients(ingredientName){
        let productsSearchedIds = [];//id названий продуктов, которые подходят под запрос
        for(let productId in this.state.productNames){
            if(this.state.productNames[productId].indexOf(ingredientName) >= 0)
                productsSearchedIds.push(+productId);
        }
        //console.log(productsSearchedIds);
        //найдены продукты, подходящие под запрос
        if(productsSearchedIds.length){
            let mealHas;
            //цикл по блюдам
            for(let key in this.state.mealsList){
                mealHas = false;
                //цикл по найденным продуктам
                for(let i in productsSearchedIds){
                    //если в составе блюда содержится найденный продукт
                    if(this.state.mealsList[key]['ingredients'].includes(productsSearchedIds[i])){
                        mealHas = true;
                        break;
                    }
                }
                this.state.mealsList[key]['active'] = mealHas;
            }
            this.setState({mealsList: this.state.mealsList});
        }
        //ничего не найдено
        else
            this.setAllMealsActiveOrNot(false);
    }
    render() {
        let somethingIsActive = false;
        let mealsList = Object.entries(this.state.mealsList).map(([key, value]) => {
            if(value['active']){
                somethingIsActive = true;
                return <PrintMeal key={key} name={value['name']} composition={value['ingredients']} products={this.state.productNames} />;
            }
        });

        if(somethingIsActive)
            mealsList = <ul>{mealsList}</ul>;
        else
            mealsList = <div className='nothingFound'>Нет блюд с этим ингредиентом</div>;
        return (
            <div className='a'>
                <h1>Список блюд</h1>
                <input
                        name='ingredientSearch'
                        placeholder='Введите название продукта'
                        value={this.state.ingredientSearch}
                        onChange={this.handleChange}
                />
                
                {mealsList}
            </div>
        );
    }
}

ReactDOM.render(
  <App />,
  document.getElementById('content')
);