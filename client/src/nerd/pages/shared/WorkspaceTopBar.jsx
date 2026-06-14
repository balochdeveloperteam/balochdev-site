import WorkspaceSwitcher from './WorkspaceSwitcher';

export default function WorkspaceTopBar({ current, showAdmin, showTeam }) {
  return (
    <div className="ndx-workspace-topbar">
      <WorkspaceSwitcher current={current} showAdmin={showAdmin} showTeam={showTeam} />
    </div>
  );
}
