import React from 'react';
import TeamMemberForm from './team_member_form';
import TeamMemberIndexItem from './team_member_index_item';

class TeamMemberIndex extends React.Component {
  componentDidMount() {
    this.props.fetchMembers(this.props.match.params.teamId);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.teamId !== nextProps.match.params.teamId) {
      this.props.fetchMembers(nextProps.match.params.teamId);
    }
  }

  render() {
    const li = this.props.members.map(member => {
      return <TeamMemberIndexItem member={member} />;
    });

    if (li.length < 6) {
      const length = li.length;
      for (let i = 0; i < 6 - length; i++) {
        li.push(<TeamMemberIndexItem member={undefined} />);
      }
    }

    return (
      <div className='team-members'>
        <TeamMemberForm
          teamId={this.props.match.params.teamId}
          addMembers={this.props.addMembers}/>
        <ul className='member-list'>
          {li}
        </ul>
      </div>
    );
  }
}

export default TeamMemberIndex;
