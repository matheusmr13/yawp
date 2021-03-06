package io.yawp.repository.pipes.pump;

import io.yawp.commons.utils.JsonUtils;
import io.yawp.repository.Yawp;
import io.yawp.repository.query.QueryBuilder;

import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public abstract class Pump<T> implements Serializable {

    private static final long serialVersionUID = -1147341944765139597L;

    protected Class<?> clazz;

    protected int defaultBatchSize;

    private List<T> objects = new ArrayList<>();

    protected int queryIndex = 0;

    private String cursor;

    private List<PumpGenerator<T>> generators = new ArrayList<>();

    private int generatorIndex = 0;

    public Pump(Class<?> clazz, int batchSize) {
        this.clazz = clazz;
        this.defaultBatchSize = batchSize;
    }

    public abstract void addQuery(QueryBuilder<?> query);

    protected abstract QueryBuilder<?> getQueryAt(int queryIndex);

    protected abstract List<T> executeQueryAt(int queryIndex);

    protected abstract int getQueriesSize();

    public void add(T object) {
        objects.add(object);
    }

    public void addAll(List<T> newObjects) {
        objects.addAll(newObjects);
    }

    public void addGenerator(PumpGenerator<T> generator) {
        generators.add(generator);
    }

    public List<T> more() {
        if (hasMoreObjects()) {
            List<T> list = moreFromList();
            if (list.size() < defaultBatchSize && hasMoreQueries()) {
                list.addAll(moreFromQuery(defaultBatchSize - list.size()));
            }
            return list;
        }
        if (hasMoreQueries()) {
            List<T> list = moreFromQuery(defaultBatchSize);
            if (list.size() < defaultBatchSize && hasMoreGenerators()) {
                list.addAll(moreFromGenerators(defaultBatchSize - list.size()));
            }
            return list;

        }
        return moreFromGenerators(defaultBatchSize);
    }

    private List<T> moreFromList() {
        List<T> list = new ArrayList<>();

        int fromIndex = 0;
        int toIndex = defaultBatchSize;

        if (toIndex >= objects.size()) {
            toIndex = objects.size();
        }

        List<T> subList = objects.subList(fromIndex, toIndex);
        list.addAll(subList);
        subList.clear();
        return list;
    }

    private List<T> moreFromQuery(int batchSize) {
        List<T> list = executeQueryAt(batchSize, queryIndex);
        if (list.size() < batchSize) {
            queryIndex++;
            cursor = null;
            if (hasMoreQueries()) {
                list.addAll(moreFromQuery(defaultBatchSize - list.size()));
            }
        }
        return list;
    }

    private List<T> moreFromGenerators(int batchSize) {
        PumpGenerator<T> generator = generators.get(generatorIndex);
        List<T> list = generator.more(batchSize);
        if (list.size() < batchSize) {
            generatorIndex++;
            if (hasMoreGenerators()) {
                list.addAll(moreFromGenerators(defaultBatchSize - list.size()));
            }
        }
        return list;
    }

    private List<T> executeQueryAt(int batchSize, int queryIndex) {
        QueryBuilder<?> q = getQueryAt(queryIndex);
        configureQuery(batchSize, q);
        List<T> list = executeQueryAt(queryIndex);
        cursor = q.getCursor();
        return list;
    }

    private void configureQuery(int batchSize, QueryBuilder<?> q) {
        if (cursor != null) {
            q.cursor(cursor);
        }
        q.limit(batchSize);
    }

    public Set<T> all() {
        Set<T> all = new HashSet<>();
        while (hasMore()) {
            all.addAll(more());
        }
        return all;
    }

    public boolean hasMore() {
        return hasMoreObjects() || hasMoreQueries() || hasMoreGenerators();
    }

    protected boolean hasMoreQueries() {
        return queryIndex < getQueriesSize();
    }

    private boolean hasMoreGenerators() {
        if (generatorIndex >= generators.size()) {
            return false;
        }
        return generators.get(generatorIndex).hasMore();
    }

    private boolean hasMoreObjects() {
        return objects.size() != 0;
    }

    // Pumps may be serialized to be processed by asynchronous queues

    private void writeObject(ObjectOutputStream out) throws IOException {
        out.writeObject(clazz);
        out.writeInt(defaultBatchSize);
        out.writeInt(queryIndex);
        out.writeObject(cursor);
        out.writeObject(generators);
        out.writeInt(generatorIndex);
        writeObjects(out);
    }

    private void readObject(ObjectInputStream in) throws IOException, ClassNotFoundException {
        clazz = (Class<T>) in.readObject();
        defaultBatchSize = in.readInt();
        queryIndex = in.readInt();
        cursor = (String) in.readObject();
        generators = (List<PumpGenerator<T>>) in.readObject();
        generatorIndex = in.readInt();
        objects = readObjects(in);
    }

    private List<T> readObjects(ObjectInputStream in) throws IOException, ClassNotFoundException {
        List<String> jsonList = (List<String>) in.readObject();
        List<T> objects = new ArrayList<>();
        for (String json : jsonList) {
            objects.add((T) JsonUtils.from(Yawp.yawp(), json, clazz));
        }
        return objects;
    }

    private void writeObjects(ObjectOutputStream out) throws IOException {
        List<String> jsonList = new ArrayList<>();
        for (Object object : objects) {
            jsonList.add(JsonUtils.to(object));
        }
        out.writeObject(jsonList);
    }

}
