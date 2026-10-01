'use client'

import { PageHeader } from '../ui/page-header'
import { ErrorBox, LoadingBlock } from '@/components/common/states'
import { useAsync } from '@/hooks/use-async'
import { adminService } from '@/lib/services'
import { formatDate } from '@/lib/utils'

export function UsersView() {
  const { data, error, loading, reload } = useAsync(() => adminService.users(), [])

  return (
    <>
      <PageHeader title="Users" subtitle="Everyone registered on VELUNE." />
      {error ? (
        <ErrorBox message={error} retry={reload} />
      ) : loading && !data ? (
        <LoadingBlock />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[.04]">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="text-[10px] uppercase tracking-[.2em] text-white/40">
              <tr className="border-b border-white/10">
                <th className="px-5 py-4 font-normal">User</th>
                <th className="px-5 py-4 font-normal">Role</th>
                <th className="px-5 py-4 font-normal">Joined</th>
                <th className="px-5 py-4 font-normal">Stories played</th>
              </tr>
            </thead>
            <tbody>
              {(data ?? []).map((u) => (
                <tr key={u.id} className="border-b border-white/5 last:border-0">
                  <td className="px-5 py-4">
                    <p className="font-medium">{u.name}</p>
                    <p className="mt-1 text-xs text-white/45">{u.email}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-3 py-1 text-[10px] uppercase tracking-[.18em] ${u.role === 'admin' ? 'bg-violet-300/15 text-violet-200' : 'bg-white/10 text-white/50'}`}>{u.role}</span>
                  </td>
                  <td className="px-5 py-4 text-white/50">{formatDate(u.createdAt)}</td>
                  <td className="px-5 py-4 text-white/70">{u.storiesPlayed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}