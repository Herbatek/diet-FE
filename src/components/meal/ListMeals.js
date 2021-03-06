import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Input} from 'antd';

import {fetchMeals, searchMeals, setMenuItem} from "../../actions";
import '../common/list.css';
import ShowMealList from "../common/ShowMealList";


class MealList extends Component {
    state = {
        searched: false,
        searchValue: '',
        pageSize: 5
    };

    componentDidMount() {
        this.props.setMenuItem('meal-list');
        this.props.fetchMeals(0, this.state.pageSize);
    }

    onChange = page => {
        const {searched, searchValue, pageSize} = this.state;
        searched ? this.props.searchMeals(searchValue, page - 1, pageSize) : this.props.fetchMeals(page - 1, pageSize);
    };

    render() {
        const {Search} = Input;
        const {searchValue, pageSize} = this.state;
        const {list, totalElements, currentPage, isLoading} = this.props.allMeals;

        return (
            <div className='content__list'>
                <div className='header'>
                    <h1><label>Lista posiłków</label></h1>
                    <Search
                        placeholder="Wyszukaj posiłek"
                        onSearch={value => {
                            this.props.searchMeals(value, 0, pageSize);
                            this.setState({searched: true});
                        }}
                        onChange={e => this.setState({searchValue: e.target.value})}
                        value={searchValue}
                        enterButton
                        size="large"
                    />
                </div>
                <div className='list'>
                    <ShowMealList
                        mealsList={list}
                        totalElements={totalElements}
                        currentPage={currentPage}
                        isLoading={isLoading}
                        onChange={this.onChange}/>
                </div>
            </div>
        );
    }
}

const mapStateToProps = ({meals}) => {
    return {
        allMeals: meals.allMeals
    }
};

export default connect(mapStateToProps, {fetchMeals, searchMeals, setMenuItem})(MealList);