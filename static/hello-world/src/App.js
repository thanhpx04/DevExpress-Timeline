import React, { useEffect, useState } from "react";
import Gantt, { Tasks, Dependencies, Resources, ResourceAssignments, Column, Editing, Toolbar, Item, Validation, } from "devextreme-react/gantt";
import { tasks, dependencies, resources, resourceAssignments, } from "./data/ManageData";

function App() {
  var coloredDependencies = ["0", "1"];

  const critical = {
    text: 'Critical',
    // icon: 'info',
    stylingMode: 'text',
    onClick: () => { onCriticalClick(); },
  };

  const onCriticalClick = () => {
    coloredDependencies.forEach(d => {
      console.log(d)
      document.querySelectorAll(`div[dependency-id='${d}']`).forEach((n) => (n.style.borderColor = "red"));
    })
  };

  return (
    <div>
      <ul className="search-criteria-list">
        <li>aaa</li>
      </ul>
      <div>
        <Gantt
          taskListWidth={500}
          scaleType="weeks" //'auto' | 'minutes' | 'hours' | 'sixHours' | 'days' | 'weeks' | 'months' | 'quarters' | 'years';
          height={700}
          onContentReady={onContentReady}
        >
          <Tasks dataSource={tasks} />
          <Dependencies dataSource={dependencies} />
          <Resources dataSource={resources} />
          <ResourceAssignments dataSource={resourceAssignments} />

          <Toolbar>
            <Item name="undo" />
            <Item name="redo" />
            <Item name="separator" />
            <Item name="collapseAll" />
            <Item name="expandAll" />
            <Item name="separator" />
            <Item name="addTask" />
            <Item name="deleteTask" />
            <Item name="separator" />
            <Item name="zoomIn" />
            <Item name="zoomOut" />
            <Item name="separator" />
            <Item name="showResources" />
            <Item name="showDependencies" />
            <Item name="separator" />
            <Item widget="dxButton" options={critical} />
          </Toolbar>

          <Column dataField="title" caption="Subject" width={300} />
          <Column dataField="start" caption="Start Date" />
          <Column dataField="end" caption="End Date" />

          <Validation autoUpdateParentTasks />
          <Editing enabled />
        </Gantt>
      </div>
    </div>
  );
}

export default App;
