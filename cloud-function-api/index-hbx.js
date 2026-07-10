'use strict';
const db = uniCloud.database();
const _ = db.command;

module.exports = async (event, context) => {
  const { action, collection, data, query, where, field, limit, skip, orderby, id } = event;

  try {
    let result;

    switch (action) {
      case 'select':
      case 'query':
      case 'get': {
        let dbQuery = db.collection(collection);
        if (where && Object.keys(where).length > 0) {
          dbQuery = dbQuery.where(where);
        }
        if (field) {
          dbQuery = dbQuery.field(field);
        }
        if (orderby) {
          dbQuery = dbQuery.orderBy(orderby);
        }
        if (skip) {
          dbQuery = dbQuery.skip(skip);
        }
        if (limit) {
          dbQuery = dbQuery.limit(limit);
        }
        result = await dbQuery.get();
        return {
          success: true,
          data: result.data,
          count: result.result ? result.result.count : undefined
        };
      }

      case 'add':
      case 'insert': {
        const addResult = await db.collection(collection).add(data);
        return {
          success: true,
          id: addResult.id,
          _id: addResult.id
        };
      }

      case 'update': {
        let updateQuery = db.collection(collection);
        if (id) {
          updateQuery = updateQuery.doc(id);
        } else if (where) {
          updateQuery = updateQuery.where(where);
        }
        const updateResult = await updateQuery.update(data);
        return {
          success: true,
          updated: updateResult.updated
        };
      }

      case 'remove':
      case 'delete': {
        let removeQuery = db.collection(collection);
        if (id) {
          removeQuery = removeQuery.doc(id);
        } else if (where) {
          removeQuery = removeQuery.where(where);
        }
        const removeResult = await removeQuery.remove();
        return {
          success: true,
          deleted: removeResult.deleted
        };
      }

      case 'count': {
        let countQuery = db.collection(collection);
        if (where && Object.keys(where).length > 0) {
          countQuery = countQuery.where(where);
        }
        const countResult = await countQuery.count();
        return {
          success: true,
          total: countResult.total
        };
      }

      default:
        return {
          success: false,
          error: '未知的action: ' + action
        };
    }
  } catch (e) {
    console.error('数据库操作失败', e);
    return {
      success: false,
      error: e.message || '操作失败'
    };
  }
};
