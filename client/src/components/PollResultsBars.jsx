function PollResultsBars({ poll, compact = false }) {
  if (!poll?.options?.length) return null;

  const totalVotes = poll.totalVotes || 0;

  return (
    <div className={compact ? "pv-bars pv-bars-compact" : "pv-bars"}>
      {poll.options.map((option, index) => {
        const percent =
          totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;

        return (
          <div key={index} className="pv-result-item">
            <div className="pv-result-top">
              <strong>{option.text}</strong>
              <span>
                {option.votes} votes · {percent}%
              </span>
            </div>

            <div className="pv-progress">
              <div
                className="pv-progress-fill"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default PollResultsBars;