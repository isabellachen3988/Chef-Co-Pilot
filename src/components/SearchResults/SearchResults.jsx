import React from 'react';
import styles from './SearchResults.less';
import { List, Card, Row, Rate } from 'antd';
import { RocketOutlined, FieldTimeOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const recipeSummary = (difficulty, prepTime) => {
  return (
    <div>
      {/* Col1: difficulty */}
      <Row span={6} className={styles.summaryRow}>
        <span>
          <Rate
            character={<RocketOutlined />}
            disabled
            defaultValue={difficulty}
            allowHalf={true}
          />
          <span className={styles.labelText}>{'Difficulty: ' + difficulty/2 + '/5'}</span>
        </span>
      </Row>

      {/* Col2: Prep time */}
      <Row span={12} className={styles.summaryRow}>
        <span className={styles.labelText}>
          <FieldTimeOutlined />
          <span className={styles.labelText}>{'Prep Time: ' + prepTime}</span>
        </span>
      </Row>
    </div>
  );
};

/**
 * This function is used to construct a nutrition label widget. Code is refactored from
 * reference design here: https://codepen.io/chriscoyier/pen/egHEK
 */
export default ({handleChange, recipeList, totalPage}) => {
  return (
    <Card>
      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 2,
          md: 2,
          lg: 2,
          xl: 3,
          xxl: 3,
        }}
        size="large"
        header={<h1 style={{'margin':'20px'}}>Search Results</h1>}
        pagination={{
          onChange: handleChange,
          pageSize: 9,
          total: totalPage,
          pageSizeOptions: [9],
        }}
        bordered={true}
        dataSource={recipeList}
        renderItem={item => {
          let img_url = item.image
          if(img_url == null){
            img_url = item.mediaURL.url
          }

          let titleClassName;
          if (item.title.length > 35){
            titleClassName = styles.recipeTitleSmall
          } else{
            titleClassName = styles.recipeTitle
          }

          return(
            <List.Item key={item.id+"_list_item"}>
              <Link to={"/recipe/" + item.id}>
                <Card hoverable cover={<img width={272} alt="recipe_image" src={img_url} />}>
                  <span className={titleClassName}>
                    {item.title}
                  </span>
                  <br/>
                  <span className={styles.descriptionText}>
                    {item.description}
                  </span>
                  {recipeSummary(item.difficulty, item.cooktime)}
                </Card>
              </Link>
            </List.Item>
          )
        }}
      />
    </Card>
  );
}





