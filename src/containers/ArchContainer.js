import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { Grid, Row, Col, Button, Modal } from 'react-bootstrap';

import { Grid as SSCGrid, Form } from 'ssc-grid';

import NormalWidget from '../components/NormalWidget';
import AdminEditDialog from '../components/AdminEditDialog';
import AdminAlert from '../components/AdminAlert';

import * as Actions from '../actions/arch';

// Consants for table
const ItemsPerPage = 15;

class ArchContainer extends Component {
  static PropTypes = {
    //dispatch: PropTypes.func.isRequired
  }

  state = {
    activePage: 1,
    startIndex: 0
  }

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.fetchTableBodyData(this.props.params.baseDocId, ItemsPerPage, this.state.startIndex);
    this.props.fetchTableColumnsModel(this.props.params.baseDocId);
  }

  componentWillReceiveProps(nextProps) {
    const nextType = nextProps.params.baseDocId;
    const currentType = this.props.params.baseDocId;
    // 当跳转到其他类型的基础档案时候，重新加载表格数据
    if (nextType !== currentType) {
      this.props.fetchTableBodyData(nextType, ItemsPerPage, this.state.startIndex);
      this.props.fetchTableColumnsModel(nextType);
    }
  }

  // admin card actions
  handleCreate(event) {
    const { tableData } = this.props;
    const rowData = tableData[0];
    this.props.showCreateDialog(rowData);
  }

  closeEditDialog() {
    this.props.closeEditDialog();
  }

  closeCreateDialog() {
    this.props.hideCreateDialog();
  }

  // create form
  handleCreateFormBlur(label, value) {
    //this.props.updateCreateFormFieldValue(label, value);
  }
  handleCreateFormSubmit(event, formData) {
    const { startIndex } = this.state;
    const { baseDocId } = this.props.params;
    //this.props.submitCreateForm();
    this.props.saveTableData(baseDocId, formData);
    this.props.fetchTableBodyData(baseDocId, ItemsPerPage, startIndex);
    event.preventDefault();
  }
  handleCreateFormReset(event) {
    this.props.hideCreateDialog();
    event.preventDefault();
  }

  // edit form
  handleEditFormBlur(index, fieldModel, value) {
    //this.props.updateEditFormFieldValue(index, fieldModel, value);
  }
  handleEditFormSubmit(event, formData) {
    const { startIndex } = this.state;
    const { editDialog: { rowIdx } } = this.props;
    const { baseDocId } = this.props.params;
    //this.props.submitEditForm();
    this.props.saveTableData(baseDocId, formData, rowIdx);
    event.preventDefault();
  }
  handleEditFormReset(event) {
    this.props.closeEditDialog();
    event.preventDefault();
  }

  handlePageAlertDismiss(){
    this.props.hideAdminAlert();
  }

  handleFormAlertDismiss(){
    this.props.hideAdminAlert();
  }

  // http://git.yonyou.com/sscplatform/ssc_web/commit/767e39de04b1182d8ba6ad55636e959a04b99d2b#note_3528
  //handlePagination(event, selectedEvent) {
  handlePagination(eventKey) {
    const { tableData } = this.props;
    let nextPage = eventKey;
    let startIndex = (nextPage-1) * ItemsPerPage;

    this.props.fetchTableBodyData(this.props.params.baseDocId, ItemsPerPage, startIndex);

    this.setState({
      activePage: nextPage,
      startIndex
    });
  }

  getCustomComponent() {
    var containerThis = this;
    return React.createClass({
      handleEdit(event) {
        const { rowIdx, rowObj } = this.props;
        // 将rowData保存到store中
        containerThis.props.showEditDialog(rowIdx, rowObj);
        // 从store中取出editFormData填充到表单上
        containerThis.props.initEditFormData(rowObj);
      },
      handleRemove(event) {
        if (!confirm("是否删除？")) {
          return;
        }
        const { rowIdx, rowObj } = this.props;
        const { startIndex } = containerThis.state;
        const { baseDocId } = containerThis.props.params;
        containerThis.props.deleteTableData(baseDocId, rowIdx, rowObj);
        containerThis.props.fetchTableBodyData(baseDocId, ItemsPerPage, startIndex);
      },
      render() {
        return (
          <td>
            <span onClick={this.handleEdit}
              className="glyphicon glyphicon-pencil"></span>
            <span onClick={this.handleRemove}
              className="glyphicon glyphicon-trash"></span>
          </td>
        );
      }
    });
  }

  render() {
    const {
      tableData, fields,
      editDialog, editFormData,
      createDialog,
      adminAlert, formAlert
    } = this.props;

    // 表单字段模型 / 表格列模型
    const cols = fields || [];

    const formDefaultData = {};
    cols.map(fieldModel => {
      formDefaultData[fieldModel.id] = '';
    })

    var url = './screenshot_20170224_011.jpg';
    return (
      <div>
        <AdminAlert show={adminAlert.show} bsStyle={adminAlert.bsStyle}
          onDismiss={::this.handlePageAlertDismiss}
        >
          <p>{adminAlert.message}</p>
          { adminAlert.resBody ? <p>为了方便定位到问题，如下提供了详细信息：</p> : null }
          { adminAlert.resBody ? <pre>{adminAlert.resBody}</pre> : null }
        </AdminAlert>
        <Grid>
          <Row className="show-grid">
            <Col md={12}>
              <h3>基础档案id {this.props.params.baseDocId}</h3>
              <div className="fuck" style={{ display: 'none' }}>
                <img src={url} />
              </div>
              <div style={{ display: 'inline-block', float: 'right' }}>
                <Button onClick={::this.handleCreate}>创建</Button>
              </div>
            </Col>
          </Row>
          <Row className="show-grid">
            <Col md={12}>
              <NormalWidget />
              <SSCGrid tableData={tableData} columnsModel={cols}
                paging
                itemsPerPage={ItemsPerPage}
                totalPage={this.props.totalPage}
                activePage={this.state.activePage}
                onPagination={::this.handlePagination}
                operationColumn={{}}
                operationColumnClass={this.getCustomComponent()}
              />
            </Col>
          </Row>
        </Grid>
        <AdminEditDialog className='edit-form' title='编辑' {...this.props} show={editDialog.show} onHide={::this.closeEditDialog}>
          <AdminAlert show={formAlert.show} bsStyle={formAlert.bsStyle}
            onDismiss={::this.handleFormAlertDismiss}
          >
            <p>{formAlert.message}</p>
            { formAlert.resBody ? <p>为了方便定位到问题，如下提供了详细信息：</p> : null }
            { formAlert.resBody ? <pre>{formAlert.resBody}</pre> : null }
          </AdminAlert>
          <Form
            fieldsModel={cols}
            defaultData={editFormData}
            onBlur={::this.handleEditFormBlur}
            onSubmit={::this.handleEditFormSubmit}
            onReset={::this.handleEditFormReset}
          />
        </AdminEditDialog>
        <AdminEditDialog className='create-form' title='创建' {...this.props} show={createDialog.show} onHide={::this.closeCreateDialog}>
          <Form
            fieldsModel={cols}
            defaultData={formDefaultData}
            onBlur={::this.handleCreateFormBlur}
            onSubmit={::this.handleCreateFormSubmit}
            onReset={::this.handleCreateFormReset}
          />
        </AdminEditDialog>
      </div>
    );
  }
};

const mapStateToProps = (state, ownProps) => {
  return {...state.arch,
    arch: state.arch,
    tableData: state.arch.tableData,
    fields: state.arch.fields,
    totalPage: state.arch.totalPage
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(Actions, dispatch);
}

// The component will subscribe to Redux store updates.
export default connect(mapStateToProps, mapDispatchToProps)(ArchContainer);
