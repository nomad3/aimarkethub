import React from 'react'
import { useQuery } from 'react-query'
import { BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts'
import { useTable } from 'react-table'

const AdminDashboard = () => {
  const { data: metrics } = useQuery('adminMetrics', () =>
    axios.get('/api/v1/admin/metrics')
  )

  const { data: users } = useQuery(['adminUsers', { page: 1 }], () =>
    axios.get('/api/v1/admin/users')
  )

  const columns = React.useMemo(() => [
    { Header: 'ID', accessor: 'id' },
    { Header: 'Email', accessor: 'email' },
    { Header: 'Status', accessor: 'is_active' }
  ], [])

  const tableInstance = useTable({ columns, data: users?.data || [] })

  return (
    <div className="p-6 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-bold">Total Papers</h3>
          <p className="text-2xl">{metrics?.total_papers}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-bold">Avg Processing Time</h3>
          <p className="text-2xl">{metrics?.avg_processing_time?.toFixed(2)}s</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-xl font-bold mb-4">Top Papers</h3>
        <BarChart width={600} height={300} data={metrics?.top_scores}>
          <XAxis dataKey="title" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="market_score" fill="#4F46E5" />
        </BarChart>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-xl font-bold mb-4">User Management</h3>
        <table className="min-w-full" {...tableInstance.getTableProps()}>
          <thead>
            {tableInstance.headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th className="text-left p-2 border-b" {...column.getHeaderProps()}>
                    {column.render('Header')}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...tableInstance.getTableBodyProps()}>
            {tableInstance.rows.map(row => {
              tableInstance.prepareRow(row)
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => (
                    <td className="p-2 border-b" {...cell.getCellProps()}>
                      {cell.render('Cell')}
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
} 