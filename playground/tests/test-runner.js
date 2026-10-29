'use strict';

class TestRunner {
    async runAllTests(options = {}) {
        const suites = [
            { key: 'visual', enabled: options.runVisual !== false, name: 'VisualRegressionTests' },
            { key: 'performance', enabled: options.runPerformance !== false, name: 'PerformanceBenchmarkTests' },
            { key: 'compatibility', enabled: options.runCompatibility !== false, name: 'CrossBrowserCompatibilityTests' }
        ];
        const results = {};

        for (const suite of suites) {
            if (!suite.enabled) continue;

            const Suite = globalThis[suite.name];
            if (typeof Suite !== 'function') {
                results[suite.key] = { passed: false, error: `${suite.name} is not loaded.` };
                continue;
            }

            try {
                const tests = await new Suite().runAllTests();
                const testResults = Array.isArray(tests) ? tests : [];
                results[suite.key] = {
                    passed: testResults.every(test => test.passed !== false),
                    count: testResults.length,
                    tests: testResults
                };
            } catch (error) {
                results[suite.key] = { passed: false, error: error.message || String(error) };
            }
        }

        const completedSuites = Object.values(results);
        results.overall = {
            passed: completedSuites.length > 0 && completedSuites.every(result => result.passed),
            suites: completedSuites.length
        };
        console.table(Object.entries(results).map(([suite, result]) => ({
            suite,
            passed: result.passed,
            tests: result.count ?? '-',
            error: result.error ?? ''
        })));
        return results;
    }
}

globalThis.TestRunner = TestRunner;
globalThis.runGoohubTests = options => new TestRunner().runAllTests(options);
