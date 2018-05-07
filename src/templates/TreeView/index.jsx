import React, { Component } from 'react'
import { Input, Button, Icon, Divider, Row, Spin } from 'antd'
import SortableTree, { getFlatDataFromTree, changeNodeAtPath, addNodeUnderParent, removeNodeAtPath } from 'react-sortable-tree'
import styles from './index.less'

function s20 () {
  let data = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f']
  let result = ''
  for (let i = 0; i < 24; i += 1) {
    let r = Math.floor(Math.random() * 16)
    result += data[r]
  }
  return result
}

export default class TreeView extends Component {
  constructor (props) {
    super(props)
    const { formatData } = props
    this.state = {
      searchString: '',
      loading: false,
      treeData: formatData,
      defaultData: formatData,
      editlist: [],
      edited: false,
    }
  }

  componentWillReceiveProps (nextProp) {
    if (!this.state.edited) {
      this.setState({
        treeData: nextProp.formatData,
        loading: nextProp.loading,
      })
    }
  }

  render () {
    const { onSave } = this.props
    const { editlist, searchString } = this.state
    const getNodeKey = ({ treeIndex }) => treeIndex


    const SaveTree = () => {
      this.setState({ edited: false }, onSave(this.state.treeData))
    }

    const Restore = () => {
      this.setState({
        edited: false,
        treeData: this.state.defaultData,
      })
    }

    const customSearchMethod = ({ node, searchQuery }) => {
      return (searchQuery &&
      node.title.toLowerCase().indexOf(searchQuery.toLowerCase()) > -1)
    }

    const onEdit = (node, path) => {
      const list = this.state.editlist
      list[path] = list[path] === undefined ? true : !list[path]
      this.setState(state => ({
        treeData: changeNodeAtPath({
          treeData: state.treeData,
          path,
          getNodeKey,
          newNode: { ...node },
        }),
        edited: true,
        editlist: list,
      }))
    }

    const onInputChange = (event, node, path) => {
      const title = event.target.value
      this.setState(state => ({
        treeData: changeNodeAtPath({
          treeData: state.treeData,
          path,
          getNodeKey,
          newNode: { ...node, title },
        }),
        edited: true,
      }))
    }

    const addChild = (path) => {
      this.setState(state => ({
        treeData: addNodeUnderParent({
          treeData: state.treeData,
          parentKey: path[path.length - 1],
          expandParent: true,
          getNodeKey,
          newNode: {
            _id: s20(),
            title: 'new node',
          },
        }).treeData,
        edited: true,
      }))
    }

    const removeNode = (path) => {
      this.setState(state => ({
        treeData: removeNodeAtPath({
          treeData: state.treeData,
          path,
          getNodeKey,
        }),
        edited: true,
      }))
    }
    return (
      <div className={styles.page}>
        <Row type="flex" justify="space-between">
          <Input.Search
            placeholder="Search..."
            onSearch={(value) => {
              this.setState({ searchString: value })
            }}
            enterButton
            style={{ width: 300 }}
          />
          <div>
            {this.state.edited &&
            <Button type="dashed" icon="rollback" onClick={() => Restore()} style={{ marginRight: 10 }}>放弃修改</Button>}
            <Button type="primary" icon="upload" onClick={() => SaveTree()} disabled={!this.state.edited}>保存</Button>
          </div>

        </Row>

        <Divider />
        {this.state.loading ?
          <Spin /> :
          <SortableTree
            treeData={this.state.treeData}
            onChange={treeData => this.setState({ treeData })}
            searchQuery={searchString}
            style={{ height: 800 }}
            placeholderRenderer={() => <Spin />}
            searchMethod={customSearchMethod}
            generateNodeProps={({ node, path }) => ({
              title: (<div>
                { editlist[path] ?
                  <div>
                    <Input size="small" value={node.title} onChange={event => onInputChange(event, node, path)} onPressEnter={() => onEdit(node, path)} />
                  </div>
                  :
                  <div>
                    <span>{node.title}</span>
                  </div>
                }
              </div>),
              buttons: [
                <Icon
                  type={editlist[path] ? 'check' : 'edit'}
                  style={editlist[path] ? { color: '#52c41a' } : { color: '#1890ff' }}
                  className={styles.treeBtn}
                  onClick={() => onEdit(node, path)}
                />,
                <Icon
                  type="plus-square"
                  style={{ color: '#1890ff' }}
                  className={styles.treeBtn}
                  onClick={() => addChild(path)}
                />,
                <Icon
                  type="delete"
                  style={{ color: '#f5222d' }}
                  className={styles.treeBtn}
                  onClick={() => removeNode(path)}
                />,
              ],
            })}
          />
        }
      </div>
    )
  }
}
