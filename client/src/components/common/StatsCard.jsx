const StatsCard = ({
    title,
    value,
    description,
    logo,
    logoColor
  }) => {
  return (
    <article className="flex flex-col items-start px-6 py-8 bg-white rounded-lg border border-solid border-slate-200 max-w-[272px] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] m-4 w-full h-[150px]">
      <header className="flex gap-5 justify-between self-stretch">
        <h3
          className="self-start text-sm font-medium tracking-tight leading-none text-[#0f172a]"
        >
          {title}
        </h3>
        <div
          className="flex flex-col justify-center items-center px-2 rounded-md h-[34px] w-[34px]"
          style={{ backgroundColor: logoColor }}
        >
          <img
            src={logo}
            className="object-contain aspect-square w-[18px]"
            alt="Status icon"
          />
        </div>
      </header>
      <p
        className="mt-2 text-2xl font-bold leading-none text-[#0f172a]"
      >
        {value}
      </p>
      {description && (
        <p className="mt-3.5 text-xs leading-none text-slate-500">
          {description}
        </p>
      )}
    </article>
  )
}

export default StatsCard