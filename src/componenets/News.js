import React, { Component } from "react";
import Newsitem from "./Newsitem";

import Spinner from "./Spinner";
import PropTypes from "prop-types";
import Navbar from "./Navbar";
import style from "./style.css";

export default class News extends Component {
  static defaultProps = {
    country: "in",
    pageSize: 8,
    category: "general",
  };

  static propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
  };
  capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      loading: false,
      page: 1,
      darkMode: false,
    };
    document.title = `${this.capitalizeFirstLetter(
      this.props.category
    )} - NewsParrot`;
  }

  async updateNews() {
    const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=322c561f32e749eb9af19da39ec4849f&page=${this.state.page}&pageSize=${this.props.pageSize}`;
    this.setState({ loading: true });
    let data = await fetch(url);
    let parsedData = await data.json();
    this.setState({
      articles: parsedData.articles,
      totalResults: parsedData.totalResults,
      loading: false,
    });
  }

  async componentDidMount() {
    this.updateNews();
  }

  handlePrevClick = async () => {
    this.setState({ page: this.state.page - 1 });
    this.updateNews();
  };

  handleNextClick = async () => {
    this.setState({ page: this.state.page + 1 });
    this.updateNews();
  };
  toggleDarkMode = () =>
    this.setState({ darkMode: this.state.darkMode ? false : true });
  render() {
    return (
      <div>
        <Navbar />

        <div
          className=" m-3 "
          style={style}
          data-theme={this.state.darkMode ? "dark" : "light"}
        >
          <h1 className="text-center" style={{ margin: "35px 0px" }}>
            NewsParrot - Top {this.capitalizeFirstLetter(this.props.category)}{" "}
            Headlines
          </h1>
          {this.state.loading && <Spinner />}

          <div className="row">
            {!this.state.loading &&
              this.state.articles.map((element) => {
                return (
                  <div className="col-md-4" key={element.url}>
                    <Newsitem
                      author={element.author}
                      date={element.publishedAt}
                      title={element.title ? element.title.slice(0, 45) : ""}
                      description={
                        element.description
                          ? element.description.slice(0, 80)
                          : ""
                      }
                      imageUrl={element.urlToImage}
                      newsurl={element.url}
                    />
                  </div>
                );
              })}
          </div>
          <div className="container d-flex justify-content-between">
            <button
              disabled={this.state.page <= 1}
              type="button"
              className="btn btn-dark m-2"
              onClick={this.prevpage}
            >
              &larr;Previous
            </button>
            <button
              disabled={
                this.state.page + 1 >
                Math.ceil(this.state.totalResults / this.props.pageSize)
              }
              type="button"
              className="btn btn-dark m-2 "
              onClick={this.nextpage}
            >
              Next &rarr;
            </button>
          </div>
        </div>
      </div>
    );
  }
}
