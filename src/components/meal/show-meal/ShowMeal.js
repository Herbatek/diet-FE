import React, {Component} from 'react';
import {connect} from 'react-redux';

import {fetchMeal, setMenuItem} from "../../../actions";
import AuthService from "../../../helpers/auth_service";
import {LOADING_SPIN} from './../../../helpers/messages';
import ItemInfoTable from './../../common/item-info-table';
import {Alert} from "antd";
import MealMenu from "./MealMenu";
import './ShowMeal.css';
import MealProducts from "./MealProducts";


class MealShow extends Component {
    state = {
        isLogged: AuthService.isLogged(),
        mealId: this.props.match.params.id,
    };

    componentDidMount() {
        this.props.fetchMeal(this.state.mealId);
        this.props.setMenuItem('');
    }

    onDelete = () => {
        this.props.history.push('/meals/my');
    };

    renderMeal = (meal, isActual) => {
        const {isLogged} = this.state;
        return (
            <div className='meal-show'>
                <div className='meal-show__head'>
                    <h1 className='meal-show__title'>
                        <label>{meal.name}</label>
                    </h1>
                    {isLogged ? <MealMenu mealId={meal.id} userId={meal.userId} isActual={isActual} onDelete={this.onDelete}/> : null}
                </div>
                <div className='meal-show__body'>
                    <div className='meal-show__first-panel'>
                        <div className='first-panel__image-container'>
                            <img className='first-panel__image' src={meal.imageUrl} alt={meal.name}/>
                        </div>
                        <div className='first-panel__info'>
                            <h2>Informacje o posiłku</h2>
                            <ItemInfoTable item={meal}/>
                        </div>
                    </div>
                    <div className='meal-show__second-panel'>
                        <div className='second-panel__meal-products'>
                            <MealProducts products={meal.products}/>
                        </div>
                        <div className='second-panel__description'>
                            <h2>Opis</h2>
                            <p className='second-panel__description-text'>
                                {meal.description}
                            </p>
                        </div>
                        <div className='second-panel__recipe'>
                            <h2>Przepis</h2>
                            <p className='second-panel__recipe-text'>
                                {meal.recipe}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        )
    };

    render() {
        const {selectedMeal} = this.props;

        if (!selectedMeal || selectedMeal.isLoading)
            return LOADING_SPIN;

        if (selectedMeal.isError && !this.props.location.state)
            return <Alert
                message="Błąd"
                style={{width: '80%', marginTop: '1%'}}
                description="Niestety nie udało nam się znaleźć tego posiłku."
                type="error"
                showIcon
            />;
        return (this.props.location.state && this.props.location.state.meal && selectedMeal.isError ?
            this.renderMeal(this.props.location.state.meal, false) : this.renderMeal(selectedMeal, true));
    }
}

const mapStateToProps = ({meals}) => {
    return {selectedMeal: meals.selectedMeal}
};

export default connect(mapStateToProps, {fetchMeal, setMenuItem})(MealShow);