import TradingViewWidget from "@/components/ui/TradingViewWidget";
import WatchlistButton from "@/components/WatchlistButton";
import { checkIsInWatchlist } from "@/lib/actions/watchlist.actions";
import {
    SYMBOL_INFO_WIDGET_CONFIG,
    CANDLE_CHART_WIDGET_CONFIG,
    BASELINE_WIDGET_CONFIG,
    TECHNICAL_ANALYSIS_WIDGET_CONFIG,
    COMPANY_PROFILE_WIDGET_CONFIG,
    COMPANY_FINANCIALS_WIDGET_CONFIG,
} from "@/lib/constants";

const scriptUrl = "https://s3.tradingview.com/external-embedding/embed-widget-";

const StockDetails = async ({ params }: { params: Promise<{ symbol: string }> }) => {
    const { symbol } = await params;
    const decodedSymbol = decodeURIComponent(symbol);
    const isInWatchlist = await checkIsInWatchlist(decodedSymbol);

    return (
        <div className="stock-details-container grid">
            {/* Left Column */}
            <div className="xl:col-span-2 space-y-6 sm:space-y-8">
                <TradingViewWidget
                    scriptUrl={`${scriptUrl}symbol-info.js`}
                    config={SYMBOL_INFO_WIDGET_CONFIG(decodedSymbol)}
                    height={170}
                />

                <TradingViewWidget
                    title="Candle Chart"
                    scriptUrl={`${scriptUrl}advanced-chart.js`}
                    config={CANDLE_CHART_WIDGET_CONFIG(decodedSymbol)}
                    className="custom-chart"
                    height={600}
                />

                <TradingViewWidget
                    title="Baseline Chart"
                    scriptUrl={`${scriptUrl}advanced-chart.js`}
                    config={BASELINE_WIDGET_CONFIG(decodedSymbol)}
                    className="custom-chart"
                    height={600}
                />
            </div>

            {/* Right Column */}
            <div className="xl:col-span-1 space-y-6 sm:space-y-8">
                <WatchlistButton
                    symbol={decodedSymbol}
                    company={decodedSymbol}
                    isInWatchlist={isInWatchlist}
                />

                <TradingViewWidget
                    title="Technical Analysis"
                    scriptUrl={`${scriptUrl}technical-analysis.js`}
                    config={TECHNICAL_ANALYSIS_WIDGET_CONFIG(decodedSymbol)}
                    height={400}
                />

                <TradingViewWidget
                    title="Company Profile"
                    scriptUrl={`${scriptUrl}symbol-profile.js`}
                    config={COMPANY_PROFILE_WIDGET_CONFIG(decodedSymbol)}
                    height={440}
                />

                <TradingViewWidget
                    title="Financials"
                    scriptUrl={`${scriptUrl}financials.js`}
                    config={COMPANY_FINANCIALS_WIDGET_CONFIG(decodedSymbol)}
                    height={464}
                />
            </div>
        </div>
    );
};

export default StockDetails;
