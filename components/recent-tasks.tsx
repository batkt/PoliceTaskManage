export function RecentTasks() {
  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <div className="mr-4 rounded-full bg-green-500 p-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        <div className="flex-1 space-y-1">
          <p className="text-sm font-medium leading-none">Гэмт хэргийн тайлан бэлтгэх</p>
          <p className="text-sm text-muted-foreground">Хугацаа: 2023-12-15</p>
        </div>
        <div className="font-medium text-green-500">Дууссан</div>
      </div>

      <div className="flex items-center">
        <div className="mr-4 rounded-full bg-yellow-500 p-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
        </div>
        <div className="flex-1 space-y-1">
          <p className="text-sm font-medium leading-none">Сургалтын хөтөлбөр боловсруулах</p>
          <p className="text-sm text-muted-foreground">Хугацаа: 2023-12-20</p>
        </div>
        <div className="font-medium text-amber-500">Хийгдэж буй</div>
      </div>

      <div className="flex items-center">
        <div className="mr-4 rounded-full bg-yellow-500 p-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
        </div>
        <div className="flex-1 space-y-1">
          <p className="text-sm font-medium leading-none">Хэлтсийн ажлын тайлан</p>
          <p className="text-sm text-muted-foreground">Хугацаа: 2023-12-25</p>
        </div>
        <div className="font-medium text-amber-500">Хийгдэж буй</div>
      </div>

      <div className="flex items-center">
        <div className="mr-4 rounded-full bg-red-500 p-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white"
          >
            <line x1="12" y1="2" x2="12" y2="6"></line>
            <line x1="12" y1="18" x2="12" y2="22"></line>
            <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
            <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
            <line x1="2" y1="12" x2="6" y2="12"></line>
            <line x1="18" y1="12" x2="22" y2="12"></line>
            <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
            <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
          </svg>
        </div>
        <div className="flex-1 space-y-1">
          <p className="text-sm font-medium leading-none">Төсвийн төлөвлөгөө</p>
          <p className="text-sm text-muted-foreground">Хугацаа: 2023-12-10</p>
        </div>
        <div className="font-medium text-red-500">Хоцорсон</div>
      </div>

      <div className="flex items-center">
        <div className="mr-4 rounded-full bg-green-500 p-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        <div className="flex-1 space-y-1">
          <p className="text-sm font-medium leading-none">Ажилтнуудын үнэлгээ</p>
          <p className="text-sm text-muted-foreground">Хугацаа: 2023-12-30</p>
        </div>
        <div className="font-medium text-green-500">Дууссан</div>
      </div>
    </div>
  )
}

