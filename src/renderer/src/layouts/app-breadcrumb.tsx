import { JSX } from 'react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'

import { navigationItems } from '@/config/navigation'
import { useNavigation } from '@/stores/navigation'

export function AppBreadcrumb(): JSX.Element {
  const currentView = useNavigation((state) => state.currentView)
  const navigate = useNavigation((state) => state.navigate)

  const currentItem = navigationItems.find((item) => item.view === currentView)

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink render={<a onClick={() => navigate('dashboard')} />}>Home</BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbSeparator />

        <BreadcrumbItem>
          <BreadcrumbPage>{currentItem?.title}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
