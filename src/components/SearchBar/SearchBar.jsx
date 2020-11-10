import React, {PureComponent} from 'react';
import {Button, Input, Select, Tag} from 'antd';
import {SearchOutlined} from '@ant-design/icons';
import axios from "axios";
import defaultSettings from "../../../config/defaultSettings";
import {Redirect} from "react-router";

const { api_endpoint } = defaultSettings;
const { Option } = Select;

const searchType = {
  BYINGREDIENTS: 1,
  BYTITLE: 2,
  // BYPANTRY: 3
}


const selectBefore = (handleSelectChange) => (
  <Select defaultValue="By Ingredients"
          className="select-before"
          onSelect={handleSelectChange}>
    <Option value={searchType.BYINGREDIENTS}>By Ingredients</Option>
    <Option value={searchType.BYTITLE}>By Recipe Title</Option>
    {/*<Option value={searchType.BYPANTRY}>By Pantry Items</Option>*/}
  </Select>
);

const suffix = (handleClick) => (
  <Button type="primary" icon={<SearchOutlined /> } onClick={handleClick}>
    Search
  </Button>
);

function constructTag(tagData, handleTagClose){
  const tagList = []

  for(let i = 0; i < tagData.length; i++) {
    tagList.push(<Tag color="geekblue"
                      closable
                      key={"recipeTag" + i}
                      visible={true}
                      onClose={() => handleTagClose(tagData[i])}>
                  { tagData[i] }
                  </Tag>);
  }
  return tagList;
}


/**
 * This class represent the entire comment section in recipe detail page. It contains displaying
 * available comments and a form for submitting new comments.
 */
class SearchBar extends PureComponent {
  state = {
    value: "",
    searchType: searchType.BYINGREDIENTS,
    allIngredients: [],
    redirect: false,
    queryResults:[]
  };

  constructor(props) {
    super(props);
  }

  handlePressEnter = () => {
    const newIngredient = this.state.value;
    if (newIngredient && this.state.searchType === searchType.BYINGREDIENTS){
      this.setState({
        value: "",
        allIngredients: this.state.allIngredients.concat(newIngredient)
      })
    }
  };

  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect push to={{
        pathname: "/recipe-list",
        state: { recipes: this.state.queryResults }
      }}/>
    }
  }

  handleChange = event => {
    this.setState({
      value: event.target.value
    });
  };

  handleSelectChange = value => {
    this.setState({
      searchType: value,
      allIngredients: [],
      value: ""
    });
  };

  handleTagClose = removedTag => {
    const tags = this.state.allIngredients.filter(tag => tag !== removedTag);
    this.setState({ allIngredients: tags });
  };

  handleClick = () => {
    if (this.state.searchType === searchType.BYINGREDIENTS){
      axios.post(api_endpoint +'/v1/recipes/query', {"ingredients": this.state.allIngredients})
        .then(response =>{
          this.setState({ redirect: true, queryResults: response['data']['result']})
        })
    }
    else if (this.state.searchType === searchType.BYTITLE){
      axios.post(api_endpoint +'/v1/recipes/query', {"title": this.state.value})
        .then(response =>{
          this.setState({ redirect: true, queryResults: response['data']['result'] })
        })
    }
  }

  render() {
    let placeholderMsg;
    if (this.state.searchType === searchType.BYINGREDIENTS){
      placeholderMsg = "Please input one ingredient name at a time followed by Enter..."
    } else{
      placeholderMsg = "Please enter recipe title to search..."
    }

    return (
      <div style={{ marginBottom: 16 }}>
        <Input addonBefore={selectBefore(this.handleSelectChange)}
               suffix={suffix(this.handleClick)}
               value={this.state.value}
               placeholder={placeholderMsg}
               onPressEnter={this.handlePressEnter}
               onChange={this.handleChange}
        />
        <div style={{ marginTop: 16 }}>
          { constructTag(this.state.allIngredients, this.handleTagClose) }
        </div>
        {this.renderRedirect()}
      </div>
    );
  }
}

export default SearchBar;
