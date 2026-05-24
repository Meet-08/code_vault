package com.meet.server.common.config;

import org.hibernate.boot.model.FunctionContributions;
import org.hibernate.boot.model.FunctionContributor;
import org.hibernate.query.sqm.function.FunctionKind;
import org.hibernate.query.sqm.function.SqmFunctionRegistry;
import org.hibernate.query.sqm.produce.function.PatternFunctionDescriptorBuilder;
import org.hibernate.type.StandardBasicTypes;

public class CustomPostgreSQLFunctions
        implements FunctionContributor {

    @Override
    public void contributeFunctions(
            FunctionContributions functionContributions
    ) {

        SqmFunctionRegistry registry =
                functionContributions.getFunctionRegistry();

        var typeConfiguration =
                functionContributions.getTypeConfiguration();

        new PatternFunctionDescriptorBuilder(
                registry,
                "fts_match",
                FunctionKind.NORMAL,
                "cast(?1 as tsvector) @@ to_tsquery('english', ?2)"
        )
                .setExactArgumentCount(2)
                .setInvariantType(
                        typeConfiguration
                                .getBasicTypeRegistry()
                                .resolve(StandardBasicTypes.BOOLEAN)
                )
                .register();
    }
}