import React from 'react';
import { connect } from 'react-redux';
import { fetchComments } from '../../actions/comment_actions';
import CommentIndexItem from './comment_index_item';

const mapStateToProps = state => {
  return {
    comments: Object.values(state.entities.comments),
    errors: state.errors.comments
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchComments: (taskId, commentsCount) => dispatch(fetchComments(taskId, commentsCount))
  };
};

class CommentIndex extends React.Component {
  constructor(props) {
    super(props);

    this.commentsCount = 0;
    this.handleScroll = this.handleScroll.bind(this);
  }

  handleScroll() {
    if (this.refs.iScroll.scrollTop === 0 && !this.props.errors.length) {
      this.commentsCount += 10;
      this.props.fetchComments(this.props.taskId, this.commentsCount);
    }
  }

  componentDidMount() {
    this.props.fetchComments(this.props.taskId, this.commentsCount).then(res => {
      this.refs.iScroll.scrollTo(0, 24 + 10 * 62);
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.taskId !== nextProps.taskId) {
      this.commentsCount = 0;
      this.props.fetchComments(nextProps.taskId, this.commentsCount);
    }
  }

  render() {
    const { comments, errors } = this.props;
    const li = comments.map(comment => {
      return <CommentIndexItem
        key={comment.id}
        comment={comment}/>;
    });

    return (
      <div
        className='comment-list'
        ref='iScroll'
        onScroll={this.handleScroll}>
        <div>{errors.length || !comments.length ? errors[0] : "scroll up for more..."}</div>
        <ul>
          {li}
        </ul>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CommentIndex);
