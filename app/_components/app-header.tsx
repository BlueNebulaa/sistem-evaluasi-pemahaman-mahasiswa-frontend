import { ChevronDownIcon, TrendingUpIcon } from "./icons";

type AppHeaderProps = {
  courseOptions: string[];
  userInitials: string;
};

export function AppHeader({ courseOptions, userInitials }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex h-16 items-center justify-between gap-4 px-6 lg:px-11">
        <div className="flex items-center gap-2.5">
          <span className="grid size-8 place-items-center rounded-lg bg-indigo-600 text-white">
            <TrendingUpIcon className="size-[18px]" />
          </span>
          <div className="leading-tight">
            <p className="text-[15px] font-bold text-slate-900">PahamIn</p>
            <p className="text-[11px] text-slate-500">Analisis Pemahaman Mahasiswa</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <label className="relative flex items-center gap-2 rounded-lg border border-slate-200 bg-white py-2 pl-3 pr-8 text-sm focus-within:ring-2 focus-within:ring-indigo-500/40">
            <span className="hidden text-[11px] text-slate-500 sm:inline">Mata Kuliah</span>
            <select
              defaultValue={courseOptions[0]}
              className="appearance-none bg-transparent font-semibold text-slate-900 outline-none"
            >
              {courseOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
            <ChevronDownIcon className="pointer-events-none absolute right-2.5 size-4 text-slate-500" />
          </label>
          <span className="grid size-9 place-items-center rounded-full bg-indigo-50 text-xs font-semibold text-indigo-700">
            {userInitials}
          </span>
        </div>
      </div>
    </header>
  );
}
