// // src/components/EmptyState.tsx

// import { FileSearch } from 'lucide-react';
// import { Button } from '@/components/ui/button';

// interface EmptyStateProps {
//   onOpenSearch: () => void;
// }

// export default function EmptyState({ onOpenSearch }: EmptyStateProps) {
//   return (
//     <div className="flex h-[calc(100vh-100px)] items-center justify-center p-4">
//       <div className="flex max-w-md flex-col items-center gap-2 text-center">
//         <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
//           <FileSearch className="h-10 w-10 text-muted-foreground" />
//         </div>
//         <h3 className="mt-4 text-lg font-semibold">Nenhum resultado encontrado</h3>
//         <p className="mb-4 text-sm text-muted-foreground">
//           Não encontramos documentos que correspondam à sua busca. Tente ajustar os filtros ou fazer uma nova pesquisa.
//         </p>
//         <Button onClick={onOpenSearch}>
//           <FileSearch className="mr-2 h-4 w-4" />
//           Nova busca
//         </Button>
//       </div>
//     </div>
//   );
// }

// src/components/EmptyState.tsx

import { FileSearch } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

interface EmptyStateProps {
  onOpenSearch: () => void
}

export default function EmptyState({ onOpenSearch }: EmptyStateProps) {
  return (
    <div className="flex h-[calc(100vh-100px)] items-center justify-center p-4">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FileSearch className="h-10 w-10 text-muted-foreground" />
          </EmptyMedia>

          <EmptyTitle>Nenhum resultado encontrado</EmptyTitle>

          <EmptyDescription>
            Não encontramos documentos que correspondam à sua busca. 
            Tente ajustar os filtros ou realizar uma nova pesquisa.
          </EmptyDescription>
        </EmptyHeader>

        <EmptyContent>
          <Button onClick={onOpenSearch}>
            <FileSearch className="mr-2 h-4 w-4" />
            Nova busca
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  )
}
